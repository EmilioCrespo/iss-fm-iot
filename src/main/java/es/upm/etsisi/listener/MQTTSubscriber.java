/*
 * #%L
 * IoT xfiles
 * %%
 * Copyright (C) 2016 - 2018 SYST Research Group, Universidad Politecnica de Madrid
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

package es.upm.etsisi.listener;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.regex.Pattern;

import javax.sql.rowset.spi.SyncResolver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.core.env.ConfigurableEnvironment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import es.upm.etsisi.websockets.WsSessionHandler;
import es.upm.etsisi.websockets.WebSocketPublisher;

public class MQTTSubscriber implements IListener<String, String>, MqttCallback {

	private boolean isEmergency = false;
	private Map<String, Boolean> emergencyStateRooms = new HashMap<String, Boolean>(){{
		put("office", false);
		put("hall", false);
		put("warehouse", false);
		put("dining_room", false);
	}};

	private boolean started = false;
	private boolean closed = false;

	static Logger logger = LoggerFactory.getLogger(MQTTSubscriber.class);

	private MqttClient client;
	private ConfigurableEnvironment environment;

	private String topic;
	private String clientID;
	private String brokerUrl;

	private WsSessionHandler handler;
	private WebSocketPublisher router;

	private Map<String, Map<String, String>> lastValues;

	public MQTTSubscriber(ConfigurableEnvironment environment)
			throws IOException, InterruptedException, ExecutionException {
		this.environment = environment;

		this.topic = environment.getProperty("sub_topic", "empresa/#");
		this.brokerUrl = environment.getProperty("mqtt_url", "tcp://localhost:1883");
		this.clientID = environment.getProperty("clientID", "FacilityManagement");

		router = new WebSocketPublisher(this, environment);

		lastValues = new HashMap<>();
	}

	private void init() {
		if (connect(clientID + "_sub")) {
			logger.info("MQTT Broker connected with client: " + clientID);
			client.setCallback(this);
			try {
				int qos = 0;

				client.subscribe(topic, qos);
				logger.info("Subscribed to topic: " + topic);

			} catch (MqttException e1) {
				logger.error("Can't subscribe to topic: " + topic);
			}
		} else
			logger.error("Can't connect");
	}

	@Override
	public void run() {
		if (!router.isConnected()) {
			router.connect();
		}

		init();

		while (!closed) { // stopped is volatile
			if (!started) { // only block if the task has been paused, paused is volatile.
				while (!started && !closed) {
				}
			}
		}
	}

	private boolean connect(String user) {
		MqttConnectOptions conOpt = new MqttConnectOptions();
		conOpt.setCleanSession(false);
		conOpt.setUserName(user);
		try {
			if (this.environment == null)
				client = new MqttClient(this.brokerUrl, // URI
						user, // ClientId
						new MemoryPersistence());// Persistence
			else
				client = new MqttClient(this.brokerUrl, // URI
						user, // ClientId
						new MemoryPersistence());// Persistence
			client.connect(conOpt);
		} catch (MqttException e) {
			logger.error("Error connecting to MQTT Broker with user " + user);
		}
		return client.isConnected();
	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		logger.info("MQTT Listener received on topic: '" + topic + "' message: '" + message.toString() + "'");

		ObjectMapper mapper = new ObjectMapper();
		JsonNode msg = mapper.readTree(message.toString());

			
		if (msg.has("id")) {
			String id = msg.get("id").asText();
			
			if (!lastValues.containsKey(id)) {
				lastValues.put(id, new HashMap<>());
			}
				
			if (msg.has("datatype")) {
				String datatype = msg.get("datatype").asText();
				JsonNode value = (msg.has("value"))? msg.get("value") : null;
								
				// Emergency state
				if (datatype.equals("emergency") && value != null && value.asBoolean()) {	
					logger.info("ESTADO DE EMERGENCIA");
					
					String roomID = id.replace("sensor_", "");
					this.emergencyStateRooms.put(roomID, true);
					
					this.isEmergency = true;
					handler.send(message.toString());								
				}				
				else if (datatype.equals("emergency") && value != null && !value.asBoolean()) {
					logger.info("ESTADO DE EMERGENCIA ELIMINADO");
					
					String roomID = id.replace("sensor_", "");
					this.emergencyStateRooms.put(roomID, false);
					
					// If any room has emergency flag, the emergency state keep active
					boolean result = false; 
					for (boolean active : this.emergencyStateRooms.values()) {
						result = result || active;
					}			
					
					this.isEmergency = result;
				}
				
				// Nothing is more important that an emergency!
				if (!this.isEmergency) {
					
					if (!datatype.equals("control")) {
						if (!lastValues.get(id).containsKey(datatype)) {
							lastValues.get(id).put(datatype, "");
						}
	
						if (value != null) {							
							lastValues.get(id).replace(datatype, String.valueOf(value.asDouble()));
						}
						
						handler.send(message.toString());
	
						if(lastValues.containsKey(id)) {
							Map<String, String> map = lastValues.get(id);
							if(map.containsKey("temperature") && map.containsKey("luminosity") && map.containsKey("humidity")) {
								double comfort = calculateComfortFunction(id);
								JsonNode newMsg = mapper.createObjectNode();
								((ObjectNode) newMsg).put("id", id);
								((ObjectNode) newMsg).put("datatype", "comfort");
								((ObjectNode) newMsg).put("value", comfort);
								((ObjectNode) newMsg).put("timestamp", msg.get("timestamp").asText());
	
								
								handler.send(newMsg.toString());
							}
						}
					}
				}
				
			}
		}
	}

	private double calculateComfortFunction(String sensorId) {
		
		double temperature = Double.valueOf(lastValues.get(sensorId).get("temperature"));
		double humidity = Double.valueOf(lastValues.get(sensorId).get("temperature"));
		double luminosity = Double.valueOf(lastValues.get(sensorId).get("luminosity"));
		
		double comfort = 0;
		
		if(temperature < 0) {
			comfort += temperature * 2 - 10;
		}
		else if(temperature == 0) {
			comfort -= 10;
		}
		else if(temperature > 0 && temperature < 15) {
			comfort += temperature - 10;
		}
		else if(temperature >= 15 && temperature < 24) {
			comfort += temperature * 2;
		}
		else if(temperature >= 24 && temperature < 30){
			comfort += 40 - temperature;
		}
		else {
			comfort += 30 - temperature*2; 
		}
		
		if(luminosity < 100) {
			comfort -= 10;
		}
		else if(luminosity >= 100 && luminosity < 300) {
			comfort += (1+luminosity/400) * 20;
		}
		else comfort-= 5;
		
		if(humidity < 10) {
			comfort -= 5;
		}
		else if(humidity >= 10 && humidity < 40) {
			comfort += 18;
		}
		else {
			comfort -= humidity / 3;
		}
		
		if(comfort < 0) {
			comfort = 0;
		}
		
		return comfort;
	}

	@Override
	public void close() {
		closed = true;
		this.stop();

	}

	@Override
	public void stop() {
		try {
			started = false;
			router.stop();
			client.disconnect();
		} catch (MqttException e) {
			e.printStackTrace();
		}

	}

	@Override
	public void start() {
		started = true;
	}

	@Override
	public boolean isStarted() {
		return started;

	}

	public boolean isClosed() {
		return closed;
	}

	@Override
	public void setHandler(WsSessionHandler handler) {
		this.handler = handler;
	}

	@Override
	public void connectionLost(Throwable cause) {
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken token) {
	}
}
