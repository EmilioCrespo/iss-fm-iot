package es.upm.etsisi.websockets;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.fasterxml.jackson.databind.JsonNode;

@Controller
public class DataController {

    @MessageMapping("/empresa/data")
    @SendTo("/topic/facilityManagement")
    public JsonNode getSensorData(JsonNode message) throws InterruptedException {
        //Thread.sleep(1000); // simulated delay
        return message;
    }
}
