package com.reviewx.dto;

import com.reviewx.exception.ErrorCode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String code;
    private String message;
    private LocalDateTime timestamp;
    private List<FieldErrorDetail> errors;

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // ErrorCode로부터 ErrorResponse 생성
    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(errorCode.getCode(), errorCode.getMessage());
    }

    // ErrorCode와 BindingResult로부터 ErrorResponse 생성
    public static ErrorResponse of(ErrorCode errorCode, BindingResult bindingResult) {
        ErrorResponse response = new ErrorResponse(errorCode.getCode(), errorCode.getMessage());
        response.errors = bindingResult.getFieldErrors().stream()
                .map(FieldErrorDetail::of)
                .collect(Collectors.toList());
        return response;
    }

    @Data
    @AllArgsConstructor
    public static class FieldErrorDetail {
        private String field;
        private String value;
        private String reason;

        public static FieldErrorDetail of(FieldError fieldError) {
            return new FieldErrorDetail(
                fieldError.getField(),
                fieldError.getRejectedValue() == null ? "" : fieldError.getRejectedValue().toString(),
                fieldError.getDefaultMessage()
            );
        }
    }
}