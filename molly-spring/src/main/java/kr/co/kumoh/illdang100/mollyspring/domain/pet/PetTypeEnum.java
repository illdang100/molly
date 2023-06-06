package kr.co.kumoh.illdang100.mollyspring.domain.pet;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PetTypeEnum {

    CAT("고양이"), DOG("강아지"), RABBIT("토끼"), NOT_SELECTED("선택안함");
    private String value;
}
