package dennis.dkaraoke.utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.StringTokenizer;

import org.apache.catalina.util.StringParser;

public class BuildJSONSongArrayFromDisk {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		// BuildJSONSongArrayFromDisk buildJSON = new
		// BuildJSONSongArrayFromDisk();

		File folder = new File("E:\\Karaoke");
		
		File[] files = folder.listFiles();
		
		
		// sort by last modified
		Arrays.sort(files, new Comparator<File>(){
		    public int compare(File f1, File f2)
		    {
		        return Long.valueOf(f1.lastModified()).compareTo(f2.lastModified());
		    } });

		
		
		String[] fileList = folder.list();

		StringBuffer b = new StringBuffer();
		b.append("var songData = {items: [");
		int count = 0;
		for (String fileName : fileList) {

			// remove the extension
			String index = extractIndexNumber(fileName);
			String titleArtistAlbum = fileName.substring(index.length(), fileName.lastIndexOf(".")).trim();
			StringTokenizer tokenizer = new StringTokenizer(titleArtistAlbum,".-");
			
			String title = tokenizer.hasMoreTokens() ?tokenizer.nextToken().trim():"";
			String artist = "";
			if (tokenizer.hasMoreTokens()) artist = tokenizer.nextToken().trim();
			if (count < fileList.length-1) {
				b.append("{id:\"" + index + "\",fileName:\"" + fileName + "\",title:\"" + title + "\",artist:\"" + artist + "\"},");								
				System.out.println("{id:\"" + index + "\",fileName:\"" + fileName + "\",title:\"" + title	+ "\",artist:\"" + artist + "\"},");
			} else {
				b.append("{id:\"" + index + "\",fileName:\"" + fileName + "\",title:\"" + title + "\",artist:\"" + artist + "\"}");
				System.out.println("{id:\"" + index + "\",fileName:\"" + fileName + "\",title:\"" + title + "\",artist:\"" + artist + "\"}");
			}
			count++;
		}

		b.append("]};");

		System.out.println("Total file processed: " + count);
		
		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter("/C:/Users/dennis/git/dkaraokeApp/dkaraokeApp/src/main/resources/static/data/songData.js"));
			writer.write(b.toString());
		} catch (IOException e) {
			System.err.println(e);
		} finally {
			if (writer != null) {
				try {
					writer.close();
				} catch (IOException e) {
					System.err.println(e);
				}
			}
		}
	}
	
	
	
	private static String extractIndexNumber(String fileName) {
		int firstBlank = fileName.indexOf(' ');
		int firstDot = fileName.indexOf('.');
		// take small number
		String indexNumber = null;
		String title = null;
		if (firstDot > 0 && firstBlank == -1) {
			indexNumber = fileName.substring(0,firstDot);
		}
		else if (firstDot > 0 && firstDot < firstBlank) {
			indexNumber = fileName.substring(0,firstDot);
		} else if (firstBlank > 0) {
			indexNumber = fileName.substring(0,firstBlank);
		} 
		
		return indexNumber;
	}

}
