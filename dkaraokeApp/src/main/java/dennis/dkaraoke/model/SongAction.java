package dennis.dkaraoke.model;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class SongAction {

	final public static String ADD = "add";
	final public static String REMOVE = "remove";

	private String songIndex;
	private String action;

	@XmlAttribute
	public String getSongIndex() {
		return songIndex;
	}

	public void setSongIndex(String songIndex) {
		this.songIndex = songIndex;
	}

	@XmlAttribute
	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

}
