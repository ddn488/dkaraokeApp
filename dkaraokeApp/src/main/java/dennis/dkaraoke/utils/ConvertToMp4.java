package dennis.dkaraoke.utils;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;

public class ConvertToMp4 {

	private static String fromDrive = "E:";
	private static String toDrive = "C:";

	public static void main(String[] args) throws IOException, InterruptedException {
		// ffmpeg.exe -i "E:\Karaoke\9106 Thien Duong Khong Xa.Don Ho & Thanh
		// Ha.Unknown.vob" -map 0:1 -map 0:2 -map 0:3
		// "F:\Karaoke\9106 Thien Duong Khong Xa.Don Ho & Thanh Ha.Unknown.mp4"

	
		File folder = new File(fromDrive + "\\Karaoke");

		File[] files = folder.listFiles();

		// sort by last modified
		Arrays.sort(files, new Comparator<File>() {
			public int compare(File f1, File f2) {
				return Long.valueOf(f1.lastModified()).compareTo(f2.lastModified());
			}
		});

		String[] fileList = folder.list();

		for (String fileName : fileList) {
			if (fileName.endsWith(".vob")) {

				String newFileName = fileName.substring(0, fileName.lastIndexOf(".vob")) + ".mp4";
						
				String toFile = toDrive + "\\Karaoke\\" + newFileName;

				String[] cmdarray = new String[] { "C:\\ffmpeg\\bin\\ffmpeg.exe", "-i", fileName, "-map", "0:1", "-map", "0:2", "-map",
						"0:3", toFile };
				
				Process p = Runtime.getRuntime().exec(cmdarray);
				// wait for the process completed
				p.waitFor();

			}
		}
	}

//	/*private static String constructCommand(String fromFile, String toFile) {
//
//		StringBuffer buf = new StringBuffer("ffmpeg.exe -i \"" + fromDrive);
//		return buf.toString();
//	}*/

}
