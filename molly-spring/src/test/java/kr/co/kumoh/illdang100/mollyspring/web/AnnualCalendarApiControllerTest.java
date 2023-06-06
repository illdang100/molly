package kr.co.kumoh.illdang100.mollyspring.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.medication.MedicationHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.DogEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.PetGenderEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.PetTypeEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.surgery.SurgeryHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.VaccinationHistory;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.medication.MedicationRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.pet.PetRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.surgery.SurgeryRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.vaccination.VaccinationRepository;
import kr.co.kumoh.illdang100.mollyspring.security.dummy.DummyObject;
import kr.co.kumoh.illdang100.mollyspring.service.PetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@Transactional
class AnnualCalendarApiControllerTest extends DummyObject {
    @Autowired
    EntityManager em;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper om;
    @Autowired
    private PetService petService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired private SurgeryRepository surgeryRepository;
    @Autowired private VaccinationRepository vaccinationRepository;
    @Autowired private MedicationRepository medicationRepository;


    @BeforeEach
    public void setUp() {
        dataSetting();
    }

    @Test
    @DisplayName("연간달력정보")
    @WithUserDetails(value = "molly!", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void viewAnnualSchedule_success() throws Exception {

        //given
        Account account = newAccount( "user2", "testUser2");
        accountRepository.save(account);

        Pet pet = newPet( account, "강쥐", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 5.1, PetTypeEnum.DOG, null, DogEnum.BOXER);
        petRepository.save(pet);

        SurgeryHistory surgery = SurgeryHistory.builder()
                .pet(pet)
                .surgeryName("surgery1")
                .surgeryDate(LocalDate.now().minusDays(3))
                .build();
        surgeryRepository.save(surgery);

        MedicationHistory medication = MedicationHistory.builder()
                .pet(pet)
                .medicationName("medication1")
                .medicationStartDate(LocalDate.now().minusDays(7))
                .medicationEndDate(LocalDate.now().plusDays(7))
                .build();
        medicationRepository.save(medication);

        VaccinationHistory vaccination = VaccinationHistory.builder()
                .pet(pet)
                .vaccinationName("vaccination1")
                .vaccinationDate(LocalDate.of(2022, 4, 2))
                .build();
        vaccinationRepository.save(vaccination);
        //when
        ResultActions resultActions = mockMvc.perform(get("/api/auth/calendar/" + String.valueOf(pet.getId())).contentType(MediaType.APPLICATION_JSON_VALUE));

        //then
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("연간달력정보_존재하지 않는 반려동물")
    @WithUserDetails(value = "molly!", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void viewAnnualSchedule_failure() throws Exception {

        // given
        Long petId = 56L;

        //when
        ResultActions resultActions = mockMvc.perform(get("/api/auth/calendar/" + String.valueOf(petId)).contentType(MediaType.APPLICATION_JSON_VALUE));

        //then
        resultActions.andExpect(status().isBadRequest());
    }
    
    private void dataSetting() {

        accountRepository.save(newAccount("molly!", "일당백"));

        em.clear();
    }
}