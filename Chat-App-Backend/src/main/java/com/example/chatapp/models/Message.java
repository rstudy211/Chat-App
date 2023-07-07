package com.example.chatapp.models;

import lombok.*;

import java.awt.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Message {
    private String sender;
    private String receiver;
    private String date;
    private Status status;
    private String message;

}
