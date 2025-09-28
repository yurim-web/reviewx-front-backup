package com.reviewx.dto.campaign;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParticipationRequest {
    
    private String applicationMessage;
    private String applicationReason;
}