package kr.co.kumoh.illdang100.mollyspring.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import kr.co.kumoh.illdang100.mollyspring.domain.image.PetImage;
import kr.co.kumoh.illdang100.mollyspring.domain.medication.MedicationHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.*;
import kr.co.kumoh.illdang100.mollyspring.domain.surgery.SurgeryHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.VaccinationHistory;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.cat.CatRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.dog.DogRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.image.PetImageRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.medication.MedicationRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.pet.PetRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.rabbit.RabbitRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.surgery.SurgeryRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.vaccination.VaccinationRepository;
import kr.co.kumoh.illdang100.mollyspring.security.dummy.DummyObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetRespDto.*;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PetServiceTest extends DummyObject {

    @InjectMocks
    private PetService petService;
    @Mock
    private PetRepository petRepository;
    @Mock
    private DogRepository dogRepository;
    @Mock
    private CatRepository catRepository;
    @Mock
    private RabbitRepository rabbitRepository;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private PetImageRepository petImageRepository;

    @Mock
    private SurgeryRepository surgeryRepository;
    @Mock
    private VaccinationRepository vaccinationRepository;
    @Mock
    private MedicationRepository medicationRepository;
    @Mock
    private S3Service s3Service;
    @Mock
    private MedicationService medicationService;
    @Mock
    private SurgeryService surgeryService;
    @Mock
    private VaccinationService vaccinationService;
    @Spy
    private ObjectMapper om;


    @Test
    void 반려동물_등록() throws Exception {

        // given
        PetSaveRequest saveRequest = new PetSaveRequest(PetTypeEnum.DOG, "삐삐", DogEnum.BOXER.toString(),
                LocalDate.of(2020, 1, 5), PetGenderEnum.MALE, true, 3.4, null, null);

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        // stub
        when(petRepository.findByAccount_IdAndPetName(any(), any())).thenReturn(Optional.empty());

        //when
        Long petId = petService.registerPet(saveRequest, account);

        //then
    }

    @Test
    void 반려동물_등록_실패() throws Exception {

        // given
        PetSaveRequest saveRequest = new PetSaveRequest(PetTypeEnum.DOG, "삐삐", DogEnum.BOXER.toString(),
                LocalDate.of(2020, 1, 5), PetGenderEnum.MALE, true, 3.4, null, null);

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);
        Pet pet = newPet(account, "삐삐", LocalDate.of(2020, 1, 5), PetGenderEnum.MALE, true, 3.4,
                PetTypeEnum.DOG, null, DogEnum.BOXER);

        //then
        assertThatThrownBy(() -> petService.registerPet(saveRequest, account))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    void 반려동물_수정() throws Exception {

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        Pet pet = newPet(account, "몽이", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 3.5,
                PetTypeEnum.DOG, null, DogEnum.BICHON_FRIZE);

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.of(pet));

        //given
        PetUpdateRequest updateRequest = new PetUpdateRequest(pet.getId(), PetTypeEnum.DOG, "updatePetName", DogEnum.BICHON_FRIZE.toString(),
                LocalDate.now(), PetGenderEnum.MALE, false, 4.0, "물 수도 있음");

        //when
        Long petId = petService.updatePet(updateRequest, account);

        //then
    }

    @Test
    void 반려동물_수정_실패() throws Exception {

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        Pet pet = newPet(account, "몽이", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 3.5,
                PetTypeEnum.DOG, null, DogEnum.BICHON_FRIZE);

        //stub
        when(petRepository.findById(any())).thenReturn(Optional.empty());

        //given
        PetUpdateRequest updateRequest = new PetUpdateRequest(pet.getId(), PetTypeEnum.DOG, "updatePetName", DogEnum.BICHON_FRIZE.toString(),
                LocalDate.now(), PetGenderEnum.MALE, false, 4.0, "물 수도 있음");

        //then
        assertThatThrownBy(() -> petService.updatePet(updateRequest, account))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    void 반려동물_삭제() throws Exception {

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "몽이", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 3.5,
                PetTypeEnum.DOG, null, DogEnum.BICHON_FRIZE);

        MedicationHistory medication = newMockMedication(pet, "medicationName");
        SurgeryHistory surgery = newMockSurgery(pet, "surgeryName");
        VaccinationHistory vaccination = newMockVaccination(pet, "vaccinationName");

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.of(pet));

        // stub
        when(medicationRepository.findByPet_Id(pet.getId())).thenReturn(List.of(medication));

        // stub
        when(vaccinationRepository.findByPet_Id(pet.getId())).thenReturn(List.of(vaccination));

        // stub
        when(surgeryRepository.findByPet_Id(pet.getId())).thenReturn(List.of(surgery));

        //when
        petService.deletePet(pet.getId());

        //then
    }

    @Test
    void 반려동물_삭제_실패() throws Exception {

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "몽이", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 3.5,
                PetTypeEnum.DOG, null, DogEnum.BICHON_FRIZE);

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.empty());

        //then
        assertThatThrownBy(() -> petService.deletePet(pet.getId()))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    void 반려동물_상세보기() throws Exception {

        //given
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "몽이", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 3.5,
                PetTypeEnum.DOG, null, DogEnum.BICHON_FRIZE);

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.of(pet));

        //when
        PetDetailResponse detailResponse = petService.viewDetails(pet.getId());

        //then
    }

    @Test
    void 반려동물_상세보기_실패() throws Exception {

        //given
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "몽이", LocalDate.now().minusYears(1), PetGenderEnum.MALE, true, 3.5,
                PetTypeEnum.DOG, null, DogEnum.BICHON_FRIZE);

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.empty());

        //then
        assertThatThrownBy(() -> petService.viewDetails(pet.getId()))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    void 연간달력정보() throws Exception {

        // given
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "해피", LocalDate.now().minusYears(5), PetGenderEnum.FEMALE, true, 2.7,
                PetTypeEnum.DOG, null, DogEnum.GERMAN_SPITZ);

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.of(pet));

        // when
        petService.viewAnnualCalendarSchedule(pet.getId());

        //then
    }

    @Test
    void 연간달력정보_실패() throws Exception {

        // given
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "해피", LocalDate.now().minusYears(5), PetGenderEnum.FEMALE, true, 2.7,
                PetTypeEnum.DOG, null, DogEnum.GERMAN_SPITZ);

        // stub
        when(petRepository.findById(any())).thenReturn(Optional.empty());

        //then
        assertThatThrownBy(() -> petService.viewAnnualCalendarSchedule(pet.getId()))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    void 반려동물_프로필_수정() throws Exception {

        //given
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "해피", LocalDate.now().minusYears(5), PetGenderEnum.FEMALE, true, 2.7,
                PetTypeEnum.DOG, null, DogEnum.GERMAN_SPITZ);

        MockMultipartFile multipartFile = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());
        PetProfileImageUpdateRequest petProfileImageUpdateRequest = new PetProfileImageUpdateRequest(pet.getId(), multipartFile);

        PetImage petImage = PetImage.builder()
                .petProfileImage(new ImageFile("uploadFile", "storeFile", "url"))
                .build();

        // stub
        when(petImageRepository.findByPet_Id(pet.getId())).thenReturn(Optional.of(petImage));

        // stub
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        //when
        petService.updatePetProfileImage(petProfileImageUpdateRequest);

        //then
    }

    @Test
    void 반려동물_프로필_삭제() throws Exception {

        //given
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);

        Pet pet = newPet(account, "해피", LocalDate.now().minusYears(5), PetGenderEnum.FEMALE, true, 2.7,
                PetTypeEnum.DOG, null, DogEnum.GERMAN_SPITZ);

        MockMultipartFile multipartFile = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());
        PetProfileImageUpdateRequest petProfileImageUpdateRequest = new PetProfileImageUpdateRequest(pet.getId(), multipartFile);

        PetImage petImage = PetImage.builder()
                .petProfileImage(new ImageFile("uploadFile", "storeFile", "url"))
                .build();

        // stub
        when(petImageRepository.findByPet_Id(pet.getId())).thenReturn(Optional.of(petImage));

        // stub
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        //when
        petService.deletePetProfileImage(pet.getId());

        //then\
    }
}
