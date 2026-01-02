import Foundation
import Combine

class HomeViewModel: ObservableObject {
    @Published var featuredMovie: Movie?
    @Published var trendingMovies: [Movie] = []
    
    func fetchContent() {
        Task {
            do {
                let movies = try await NetworkManager.shared.fetchMovies()
                DispatchQueue.main.async {
                    self.featuredMovie = movies.first(where: { $0.isFeatured }) ?? movies.first
                    self.trendingMovies = movies.filter { $0.isTrending }
                }
            } catch {
                print("Error fetching content: \(error)")
            }
        }
    }
}

class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    
    func login() {
        // Implement login logic
        isAuthenticated = true
    }
}
