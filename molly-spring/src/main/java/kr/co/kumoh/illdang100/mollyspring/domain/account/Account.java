package kr.co.kumoh.illdang100.mollyspring.domain.account;

import kr.co.kumoh.illdang100.mollyspring.domain.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Account extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String username;

    @Column(unique = false, length = 60) // 패스워드 인코딩(BCrypt)
    private String password;

    @Column(unique = true, length = 10)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AccountEnum role; // ADMIN, CUSTOMER

    @Column(unique = true, length = 25)
    private String email;

    @Builder
    public Account(Long id, String username, String password, String nickname, AccountEnum role, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
        this.email = email;
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }
}
