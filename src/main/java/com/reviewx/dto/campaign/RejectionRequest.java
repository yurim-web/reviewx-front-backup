package com.reviewx.dto.campaign;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RejectionRequest {
    
    private String reason;
}