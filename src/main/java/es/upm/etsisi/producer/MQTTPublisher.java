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

package es.upm.etsisi.producer;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.core.env.ConfigurableEnvironment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MQTTPublisher implements IProducer<String>{

	private MqttClient client;
	static Logger logger = LogManager.getLogger();
		
	private String topic;
	private String brokerUrl;
	private String clientID;
	
	public MQTTPublisher(ConfigurableEnvironment environment) throws MqttException {		
		this.topic = environment.getProperty("pub_topic", "empresa/control");
		this.brokerUrl = environment.getProperty("mqtt_url", "tcp://localhost:1883");	
		this.clientID = environment.getProperty("clientID", "FacilityManagement");
		
		if(connect(this.clientID + "_pub")) logger.info("MQTT Router Client connected");
		else {
			logger.error("MQTT Router can't connect to "+brokerUrl);
			this.close();
			System.exit(1);
		}		
	}
	
	@Override
	public void close() throws MqttException {
		client.disconnect();
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}
	
	@Override
	public void send(String data) {
		
		JsonNode json;
		try {
			json = new ObjectMapper().readTree(data);
			sendToMQTT(json.toString());
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void send(String topic, String data) {
		
		JsonNode json;
		try {
			json = new ObjectMapper().readTree(data);
			sendToMQTT(topic, json.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private boolean connect(String user) {
		MqttConnectOptions conOpt = new MqttConnectOptions();
		conOpt.setCleanSession(false);
		conOpt.setUserName(user);
		try {
			
			client = new MqttClient(brokerUrl, // URI
					user, // ClientId
					new MemoryPersistence());// Persistence
			//client.setTimeToWait(1000);
			client.connect(conOpt);
		} catch (MqttException e) {
			logger.error("Error connecting to MQTT Broker with user " + user);
		}
		return client.isConnected();
	}

	private void sendToMQTT(String message) {
	     try {
	    	int qos = 1; 
	    	 
	    	if(client.isConnected()) {
				client.publish(this.topic, message.getBytes("UTF-8"), qos, false);
				logger.debug("Message published in topic: "+topic);
	    	}
	    	else
	    		logger.error("The client is disconnected");

		} catch (MqttException | UnsupportedEncodingException e) {
			logger.error("MQTT Router can't publish to topic "+topic+": "+e);
		}
	}
	
	private void sendToMQTT(String topic, String message) {
	     try {
	    	int qos = 2; 
	    	 
	    	if(client.isConnected()) {
				client.publish(topic, message.getBytes("UTF-8"), qos, false);
				logger.debug("Message published in topic: "+topic);
	    	}
	    	else
	    		logger.error("The client is disconnected");

		} catch (MqttException | UnsupportedEncodingException e) {
			logger.error("MQTT Router can't publish to topic "+topic+": "+e);
		}
	}
}
