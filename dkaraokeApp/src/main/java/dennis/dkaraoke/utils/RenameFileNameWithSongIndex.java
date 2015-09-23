package dennis.dkaraoke.utils;

import java.io.File;

/**
 * 
 *     NOTE: All file name must be in format  XXXXX.Song Name.Artist.Source.fileExtension
 *     
 *     XXXXX is Song index number
 *     
 *     MUST BE ASCII characters due to javascript sear and file name system no UTF-8 character
 *      - if it's Vietnamsese font must be retype in ASCII characters
 *     
 *     
 *     
 * 
 * 
 * @author ddn488
 *
 */
public class RenameFileNameWithSongIndex {

	public static int START_SONG_INDEX = 80000;

	public static void main(String[] args) {

		File folder = new File("C:\\0_Karaoke_YOUTUBE_Selection\\0_BEATONLY_INDEX");

		File[] files = folder.listFiles();

		// sort by last modified
		// Arrays.sort(files, new Comparator<File>() {
		// public int compare(File f1, File f2) {
		// return Long.valueOf(f1.lastModified()).compareTo(
		// f2.lastModified());
		// }
		// });

		//int count = 0;
		for (File file : files) {

//			File newNameFile = new File(file.getParent() + "//"
//					+ String.valueOf(START_SONG_INDEX + count) + " "
//					+ file.getName());
			String fileName = file.getName();
			String newName = fileName.substring(0, fileName.indexOf(".mp4")) ;
			
			File newNameFile = new File(file.getParent() + "//"
					+ newName+".405Sing.mp4");
			
			file.renameTo(newNameFile);

			//count++;

		}
	}
}
