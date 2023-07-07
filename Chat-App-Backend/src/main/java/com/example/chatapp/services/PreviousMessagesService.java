package com.example.chatapp.services;

import com.example.chatapp.models.Message;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PreviousMessagesService {

    List<Message> previousMessages = new ArrayList<>();

    public void addMessage(Message message) {
        previousMessages.add(message);
    }

    public List<Message> getPreviousMessages() {
        return previousMessages;
    }
}
