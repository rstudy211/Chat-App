package com.example.chatapp.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Message {
    private String sender;
    private String receiver;
    private String date;
    private Status status;
    private String message;

}
