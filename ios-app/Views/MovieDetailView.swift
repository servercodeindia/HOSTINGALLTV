import SwiftUI

struct MovieDetailView: View {
    let movie: Movie
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                AsyncImage(url: URL(string: movie.backdropUrl)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color.gray
                }
                .frame(height: 300)
                .clipped()
                
                VStack(alignment: .leading, spacing: 10) {
                    Text(movie.title)
                        .font(.largeTitle)
                        .bold()
                    
                    HStack {
                        Text(movie.rating)
                            .padding(5)
                            .background(Color.gray.opacity(0.3))
                            .cornerRadius(5)
                        
                        Text(movie.genre)
                        Text("•")
                        Text("\(movie.duration) min")
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    
                    Button(action: {
                        // Play action
                    }) {
                        Label("Play", systemImage: "play.fill")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.white)
                            .foregroundColor(.black)
                            .cornerRadius(10)
                    }
                    .padding(.vertical)
                    
                    Text("Synopsis")
                        .font(.headline)
                    
                    Text(movie.description)
                        .foregroundColor(.secondary)
                }
                .padding()
            }
        }
        .edgesIgnoringSafeArea(.top)
        .preferredColorScheme(.dark)
    }
}
