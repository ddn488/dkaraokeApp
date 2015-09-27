package dennis.dkaraoke.javafx;

import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.media.MediaView;
import javafx.stage.Stage;

public class Main extends Application {

	@Override
	public void start(Stage primaryStage) {
		// Add a scene
		Group root = new Group();
		Scene scene = new Scene(root, 800, 450);

		Media pick = new Media("file:/c:/Users/dennis/10.mp4");
		MediaPlayer player = new MediaPlayer(pick);
		player.play();

		// Add a mediaView, to display the media. Its necessary !
		// This mediaView is added to a Pane
		MediaView mediaView = new MediaView(player);
		((Group) scene.getRoot()).getChildren().add(mediaView);

		// show the stage
		primaryStage.setTitle("Media Player");
		primaryStage.setScene(scene);
		primaryStage.show();
	}

	public static void main(String[] args) {
		launch(args);
	}
}