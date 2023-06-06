package kr.co.kumoh.illdang100.mollyspring.domain.pet;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum RabbitEnum {

    ANGORA_RABBIT("앙고라 토끼"),
    ROBYEAR("롭이어"),
    REX("렉스"),
    DUTCH("더치"),
    LIONHEAD("라이온헤드"),
    DWARF("드워프"),
    GIANT("자이언트");
    private String value;
}
