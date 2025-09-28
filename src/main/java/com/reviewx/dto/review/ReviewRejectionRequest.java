package com.reviewx.dto.review;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewRejectionRequest {
    
    private String reason;
}