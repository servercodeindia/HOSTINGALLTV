import SwiftUI
import AVKit

struct PlayerView: View {
    let videoUrl: URL
    
    var body: some View {
        VideoPlayer(player: AVPlayer(url: videoUrl))
            .edgesIgnoringSafeArea(.all)
            .navigationBarHidden(true)
    }
}
