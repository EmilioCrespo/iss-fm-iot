package es.upm.etsisi.websockets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import es.upm.etsisi.listener.IListener;
import es.upm.etsisi.listener.MQTTSubscriber;

public class WebSocketPublisher{

	private WebSocketClient client;
	private WebSocketStompClient stompClient;
	
	private String ws_uri;
	
	private boolean connected = false;
	private IListener listener;
	private ConfigurableEnvironment environment;
		
	static Logger logger = LoggerFactory.getLogger(WebSocketPublisher.class);

	public WebSocketPublisher(IListener listener, ConfigurableEnvironment environment) {
		ws_uri = environment.getProperty("ws_uri", "ws://localhost:7070/websocket");
		this.listener = listener;
		this.environment = environment;
	}
	
	public void connect() {			
		client = new StandardWebSocketClient();
		stompClient = new WebSocketStompClient(client);
		stompClient.setMessageConverter(new MappingJackson2MessageConverter());
        stompClient.setTaskScheduler(new ConcurrentTaskScheduler());
		
        StompSessionHandler sessionHandler = new WsSessionHandler(environment);
		stompClient.connect(ws_uri, sessionHandler);
		if(listener != null) {
	        listener.setHandler((WsSessionHandler) sessionHandler);
		}
        connected = true;
	}
	
	public boolean isConnected() {
		return connected;
	}
	
	public void stop() {
		stompClient.stop();
	}
}
