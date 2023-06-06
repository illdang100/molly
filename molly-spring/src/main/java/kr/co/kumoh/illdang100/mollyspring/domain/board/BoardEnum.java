package kr.co.kumoh.illdang100.mollyspring.domain.board;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum BoardEnum {

    MEDICAL("의료"), FREE ("자유");
    private String value;
}
