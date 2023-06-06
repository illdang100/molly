package kr.co.kumoh.illdang100.mollyspring.domain.pet;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PetGenderEnum {

    FEMALE("암컷"), MALE("수컷");
    private String value;
}
