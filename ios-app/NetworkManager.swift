import Foundation

class NetworkManager {
    static let shared = NetworkManager()
    private let baseURL = "https://your-replit-url.replit.app/api"
    
    func fetchMovies() async throws -> [Movie] {
        guard let url = URL(string: "\(baseURL)/movies") else { return [] }
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode([Movie].self, from: data)
    }
    
    func fetchSeries() async throws -> [Series] {
        guard let url = URL(string: "\(baseURL)/series") else { return [] }
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode([Series].self, from: data)
    }
}

struct Series: Identifiable, Codable {
    let id: Int
    let title: String
    let description: String
    let posterUrl: String
}
