import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading) {
                    if let featured = viewModel.featuredMovie {
                        FeaturedCard(movie: featured)
                            .frame(height: 500)
                            .padding(.bottom)
                    }
                    
                    Text("Trending Now")
                        .font(.title2)
                        .bold()
                        .padding(.leading)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 20) {
                            ForEach(viewModel.trendingMovies) { movie in
                                NavigationLink(destination: MovieDetailView(movie: movie)) {
                                    MovieCard(movie: movie)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                }
            }
            .navigationTitle("Home")
            .preferredColorScheme(.dark)
        }
        .onAppear {
            viewModel.fetchContent()
        }
    }
}

struct MovieCard: View {
    let movie: Movie
    
    var body: some View {
        AsyncImage(url: URL(string: movie.posterUrl)) { image in
            image.resizable()
        } placeholder: {
            Color.gray
        }
        .frame(width: 150, height: 225)
        .cornerRadius(12)
        .shadow(radius: 5)
    }
}
