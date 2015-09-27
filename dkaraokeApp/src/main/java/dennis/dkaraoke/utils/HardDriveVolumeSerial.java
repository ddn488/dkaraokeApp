package dennis.dkaraoke.utils;

import java.io.*;

public class HardDriveVolumeSerial {
    
    public static void main(String args[]) {
        System.out.println("Volume Serial ID = " + getVolumeSerialId() );
    }
    
    private static String getVolumeSerialId() {
        
        try {
            Process p = Runtime.getRuntime().exec("cmd /E dir");
            BufferedReader in = new BufferedReader(
                                new InputStreamReader(p.getInputStream()));
            String line = null;
            int count = 0;
            while ((line = in.readLine()) != null) {
                count++;
                if (count<2)
                    continue;
                if (count>2)
                    break;
                return line.substring( line.lastIndexOf(' ')+1 );
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
		return null;
    }
}