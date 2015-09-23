package dennis.dkaraoke;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * 
 * WebSocketConfig is annotated with @Configuration to indicate that it is a
 * Spring configuration class. It is also
 * annotated @EnableWebSocketMessageBroker. As its name
 * suggests, @EnableWebSocketMessageBroker enables WebSocket message handling,
 * backed by a message broker.
 * 
 * The configureMessageBroker() method overrides the default method in
 * WebSocketMessageBrokerConfigurer to configure the message broker. It starts
 * by calling enableSimpleBroker() to enable a simple memory-based message
 * broker to carry the messages back to the client on destinations prefixed with
 * "/topic". 
 * 
 * It also designates the "/app" prefix for messages that are bound
 * for @MessageMapping-annotated methods.
 * 
 * The registerStompEndpoints() method registers the "/song" endpoint, enabling
 * SockJS fallback options so that alternative messaging options may be used if
 * WebSocket is not available.
 * 
 * This endpoint, when prefixed with "/app", is the endpoint that the
 * MessageController.songTopic() method is mapped to handle.
 * 
 *
 */

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/song").withSockJS();
		registry.addEndpoint("/remoteControl").withSockJS();
	}
	
	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic");
		config.setApplicationDestinationPrefixes("/app");
	}

	

}
