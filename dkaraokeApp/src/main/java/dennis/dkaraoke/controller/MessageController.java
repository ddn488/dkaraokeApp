package dennis.dkaraoke.controller;

import java.io.File;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import dennis.dkaraoke.model.SongAction;

/*
 * Create a message-handling controller
 */
@Controller
public class MessageController {

	private Set<String> songQueue = new LinkedHashSet<String>();// to keep the
																// elements in
																// the inserting
																// order.

	@MessageMapping("/song")
	@SendTo("/topic/song")
	public Object[] songActionHandle(SongAction songAction) throws InterruptedException {

		if (songAction.getAction().equals(SongAction.ADD)) {
			songQueue.add(songAction.getSongIndex());
		} else if (songAction.getAction().equals(SongAction.REMOVE) && songQueue.contains(songAction.getSongIndex())) {
			songQueue.remove(songAction.getSongIndex());
		}

		// list of string song indexes is sent to the topic queue where all
		// subscribers will receive
		return songQueue.toArray();
	}

	@RequestMapping(value = "/getHostAddress", method = RequestMethod.GET)
	@ResponseBody
	public String getHostAddress() throws UnknownHostException, SocketException {
		String osName = System.getProperty("os.name");

		if (osName.startsWith("Windows")) {
			InetAddress ip = InetAddress.getLocalHost();
			// return ip.getHostName();
			return ip.getHostAddress();
		} else if (osName.startsWith("Linux")) {
			Enumeration<NetworkInterface> nics = NetworkInterface.getNetworkInterfaces();
			while (nics.hasMoreElements()) {
				NetworkInterface ni = nics.nextElement();
				if (ni.getName().startsWith("eth") || ni.getName().startsWith("wlan")) {
					Enumeration<InetAddress> ee = ni.getInetAddresses();
					while (ee.hasMoreElements()) {
						InetAddress i = ee.nextElement();
						if (i instanceof Inet4Address) { // use only IP4 address
							return i.getHostAddress();
						}
					}
				}
			}

		}

		return "";

	}

	@RequestMapping(value = "/getKaraokeDrive", method = RequestMethod.GET)
	@ResponseBody
	public String getKaraokeDrive() {

		String osName = System.getProperty("os.name");

		if (osName.startsWith("Windows")) {
			// search Karaoke drive location in the order "D", "E", "C", "F",
			// "G"
			String[] drives = { "/D:", "/E:", "/C:", "/F:", "/G:" };

			for (String drive : drives) {
				File f = new File(drive + "/Karaoke");
				if (f.exists()) {
					return drive;
				}
			}
		} else if (osName.startsWith("Linux")) {
			return "/media/dennis/HD-GDU3";
		}
		// file:///media/dennis/HD-GDU3/Karaoke/80060.Phai%20Chi%20Em%20Biet%20%28%20with%20Lyrics%29.Lam%20Anh.405Sing.mp4

		return "";
	}

}
