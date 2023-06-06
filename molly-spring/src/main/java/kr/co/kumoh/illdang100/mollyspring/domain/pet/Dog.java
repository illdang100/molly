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
@DiscriminatorValue("D")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Dog extends Pet{

    @Enumerated(EnumType.STRING)
    @Column(length = 25)
    private DogEnum dogSpecies;

    @Builder
    public Dog(Long id, Account account, String petName, LocalDate birthdate, PetGenderEnum gender, boolean neuteredStatus, double weight, PetTypeEnum petType, String caution, DogEnum dogSpecies) {
        super(id, account, petName, birthdate, gender, neuteredStatus, weight, petType, caution);
        this.dogSpecies = dogSpecies;
    }

    public boolean compareDogSpecies(DogEnum dogSpecies) {
        if (this.dogSpecies != dogSpecies) return false;
        return true;
    }

    public void updateDogSpecies(DogEnum dogSpecies) {
        this.dogSpecies = dogSpecies;
    }
}
