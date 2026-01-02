import Foundation

struct Movie: Identifiable, Codable {
    let id: Int
    let title: String
    let description: String
    let posterUrl: String
    let backdropUrl: String
    let videoUrl: String
    let duration: Int
    let rating: String
    let genre: String
    let isFeatured: Bool
    let isTrending: Bool
}

struct User: Codable {
    let id: Int
    let username: String
    let role: String
}
