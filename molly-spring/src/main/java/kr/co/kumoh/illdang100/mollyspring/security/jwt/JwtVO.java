package kr.co.kumoh.illdang100.mollyspring.security.jwt;

public interface JwtVO {

    public static final int ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 30; // 30분
    public static final int REFRESH_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 14; // 2주
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String ACCESS_TOKEN_HEADER = "Authorization";
    public static final String REFRESH_TOKEN_HEADER = "Refresh-Token";
}
