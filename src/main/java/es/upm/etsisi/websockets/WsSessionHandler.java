package es.upm.etsisi.websockets;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import es.upm.etsisi.producer.IProducer;
import es.upm.etsisi.producer.MQTTPublisher;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.concurrent.ExecutionException;

public class WsSessionHandler extends StompSessionHandlerAdapter {
	static Logger logger = LoggerFactory.getLogger(WsSessionHandler.class);
	private StompSession session;
	private IProducer publisher;
	private ConfigurableEnvironment environment;
	
	private boolean is_closed = false;

	public WsSessionHandler(ConfigurableEnvironment environment) {
		this.environment = environment;
		try {
			publisher = new MQTTPublisher(environment);
			logger.info("MQTT Publisher created");
		} catch (MqttException e) {
			logger.error("Error connecting to the MQTT Broker");
		}
	}
	
	@Override
	public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
		this.session = session;
		this.session.subscribe("/topic/facilityManagement", this);
		logger.info("New session: {}", this.session.getSessionId());
	}

	@Override
	public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload,
			Throwable exception) {
		exception.printStackTrace();
	}

	@Override
	public Type getPayloadType(StompHeaders headers) {
		return JsonNode.class;
	}

	@SuppressWarnings("unchecked")
	@Override
	public void handleFrame(StompHeaders headers, Object payload) {
		ObjectMapper mapper = new ObjectMapper();
		JsonNode msg;
		logger.info("WS: " + payload.toString());
		try {
			msg = mapper.readTree(payload.toString());
			if(msg.has("datatype") && msg.get("datatype").asText().equals("control")){
				JsonNode control = msg.get("command");
				String sensorID = control.get("sensor_id").asText();
				String topic = environment.getProperty("pub_topic", "empresa/control") + "/" + sensorID;
				
				publisher.send(topic, msg.toString());
			}
		} catch (IOException e) {
			logger.error("Received messsage with no JSON format");
		} catch (NullPointerException e) {
			logger.error("Received null data");
		}
	}
	
	public void send(String message) {
		try {
			session.send("/app/empresa/data", message.getBytes());
		}
		catch(IllegalStateException e) {
			logger.warn("Connection closed");
		}
		catch(MessageDeliveryException e) {
			logger.error("Error delivering the message");
		}
	}
	
	public void close() {
		try {
			session.disconnect();
			is_closed = true;
		}
		catch(IllegalStateException e) {
			logger.warn("Connection already closed");
			is_closed = true;
		}
	}

	public boolean isClosed() {
		return is_closed;
	}

	
}