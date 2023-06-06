package kr.co.kumoh.illdang100.mollyspring.domain.pet;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@DiscriminatorValue("R")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rabbit extends Pet{

    @Enumerated(EnumType.STRING)
    @Column(length = 25)
    private RabbitEnum rabbitSpecies;

    @Builder
    public Rabbit(Long id, Account account, String petName, LocalDate birthdate, PetGenderEnum gender, boolean neuteredStatus, double weight, PetTypeEnum petType, String caution, RabbitEnum rabbitSpecies) {
        super(id, account, petName, birthdate, gender, neuteredStatus, weight, petType, caution);
        this.rabbitSpecies = rabbitSpecies;
    }

    public boolean compareRabbitSpecies(RabbitEnum rabbitSpecies) {
        if (this.rabbitSpecies != rabbitSpecies) return false;
        return true;
    }

    public void updateRabbitSpecies(RabbitEnum rabbitSpecies) {
        this.rabbitSpecies = rabbitSpecies;
    }
}
