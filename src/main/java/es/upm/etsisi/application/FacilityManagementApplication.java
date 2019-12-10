package es.upm.etsisi.application;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

import es.upm.etsisi.listener.IListener;
import es.upm.etsisi.listener.MQTTSubscriber;
import es.upm.etsisi.producer.IProducer;
import es.upm.etsisi.producer.MQTTPublisher;

@SpringBootApplication(scanBasePackages = { "es.upm.etsisi" })
public class FacilityManagementApplication {
	static Logger logger = LogManager.getLogger();
	
	@SuppressWarnings("rawtypes")
	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(FacilityManagementApplication.class, args);
		ConfigurableEnvironment environment = context.getEnvironment();
		
		try {
			IListener listener = new MQTTSubscriber(environment);
			
			Thread t_subscriber = new Thread(listener, "es.upm.etsisi.FM_Listener");
			t_subscriber.start();
			
			listener.start();
		} catch (IOException | InterruptedException | ExecutionException e) {
			logger.error("Error creating the listener");
		}
			
	}
}
