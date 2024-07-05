package com.initial.first.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SignUpRequest {
    private String memberId;
    private String memberPassword;
}
