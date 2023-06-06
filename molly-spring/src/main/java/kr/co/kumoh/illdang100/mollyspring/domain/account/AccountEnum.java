package kr.co.kumoh.illdang100.mollyspring.domain.account;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AccountEnum {

    ADMIN("관리자"), CUSTOMER("고객");
    private String value;
}

