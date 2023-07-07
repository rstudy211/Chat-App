package com.example.chatapp.controllers;

import com.example.chatapp.models.Message;
import com.example.chatapp.models.Status;
import com.example.chatapp.services.PreviousMessagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins="*")
public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private PreviousMessagesService previousMessagesService;
    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receivePublicMessage(@Payload Message msg){
        if (msg.getStatus()!= Status.JOIN){
        previousMessagesService.addMessage(msg);
        }
        System.out.println(previousMessagesService.getPreviousMessages().toString());
        return msg;
    }
    @MessageMapping("/private-message")
    @SendTo("/topic/public")
    public Message receivePrivateMessage(@Payload Message msg ){
        simpMessagingTemplate.convertAndSendToUser(msg.getReceiver(),"/private",msg);
        return msg;
    }

    @GetMapping("/fetchPreviousMessages")
    public List<Message> fetchPreviousMessages(){
        System.out.println("we are fetching messagees");
        System.out.println(previousMessagesService.getPreviousMessages());
        return previousMessagesService.getPreviousMessages();
    }
}
