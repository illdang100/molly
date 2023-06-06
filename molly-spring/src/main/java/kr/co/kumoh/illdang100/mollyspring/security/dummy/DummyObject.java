package kr.co.kumoh.illdang100.mollyspring.security.dummy;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.image.PetImage;
import kr.co.kumoh.illdang100.mollyspring.domain.medication.MedicationHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.*;
import kr.co.kumoh.illdang100.mollyspring.domain.surgery.SurgeryHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.VaccinationHistory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

public class DummyObject {

    protected Account newAccount(String username, String nickname) {

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encPassword = passwordEncoder.encode("1234");

        return Account.builder()
                .username(username)
                .password(encPassword)
                .email(username + "@naver.com")
                .nickname(nickname)
                .role(AccountEnum.CUSTOMER)
                .build();
    }

    protected Account newMockAccount(Long id, String username, String nickname, AccountEnum accountEnum) {

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encPassword = passwordEncoder.encode("1234");

        return Account.builder()
                .id(id)
                .username(username)
                .password(encPassword)
                .email(username + "@naver.com")
                .nickname(nickname)
                .role(accountEnum)
                .build();
    }

    protected Pet newPet(Account account, String petName, LocalDate birthdate, PetGenderEnum gender, boolean neuteredStatus, double weight, PetTypeEnum petType, String caution, DogEnum species) {
        return Dog.builder()
                .account(account)
                .petName(petName)
                .gender(gender)
                .neuteredStatus(neuteredStatus)
                .weight(weight)
                .petType(petType)
                .birthdate(birthdate)
                .caution(caution)
                .dogSpecies(species)
                .build();
    }

    protected Pet newMockPet(Account account, String petName, LocalDate birthdate, DogEnum species) {
        return Dog.builder()
                .account(account)
                .petName(petName)
                .gender(PetGenderEnum.FEMALE)
                .neuteredStatus(true)
                .weight(3.0)
                .petType(PetTypeEnum.DOG)
                .birthdate(birthdate)
                .caution(null)
                .dogSpecies(species)
                .build();
    }

    protected MedicationHistory newMockMedication(Pet pet, String medicationName) {
        return MedicationHistory.builder()
                .pet(pet)
                .medicationName(medicationName)
                .medicationStartDate(LocalDate.now().minusDays(5))
                .medicationEndDate(LocalDate.now())
                .build();
    }

    protected SurgeryHistory newMockSurgery(Pet pet, String surgeryName) {
        return SurgeryHistory.builder()
                .pet(pet)
                .surgeryName(surgeryName)
                .surgeryDate(LocalDate.now().minusYears(1))
                .build();
    }

    protected VaccinationHistory newMockVaccination(Pet pet, String vaccinationName) {
        return VaccinationHistory.builder()
                .pet(pet)
                .vaccinationName(vaccinationName)
                .vaccinationDate(LocalDate.now().minusWeeks(2))
                .build();
    }
}
