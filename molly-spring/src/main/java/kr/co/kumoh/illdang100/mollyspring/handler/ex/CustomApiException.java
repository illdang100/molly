package kr.co.kumoh.illdang100.mollyspring.handler.ex;

public class CustomApiException extends RuntimeException {

    public CustomApiException(String message) {
        super(message);
    }
}

