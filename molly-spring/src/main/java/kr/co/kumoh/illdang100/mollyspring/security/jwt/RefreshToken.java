package kr.co.kumoh.illdang100.mollyspring.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "refresh", timeToLive = 1209600) // key값의 prefix value 설정 + TTL 설정 (1209600 = 2주)
public class RefreshToken {

    @Id
    private String id;

    private String role;

    @Indexed
    private String refreshToken;

    public void changeRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}