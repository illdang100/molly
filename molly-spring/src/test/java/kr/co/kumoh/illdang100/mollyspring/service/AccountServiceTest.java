package kr.co.kumoh.illdang100.mollyspring.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kumoh.illdang100.mollyspring.domain.image.AccountImage;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import kr.co.kumoh.illdang100.mollyspring.repository.image.AccountImageRepository;
import kr.co.kumoh.illdang100.mollyspring.security.dummy.DummyObject;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Optional;

import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountRespDto.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest extends DummyObject {

    @InjectMocks
    private AccountService accountService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountImageRepository accountImageRepository;

    @Mock
    private S3Service s3Service;

    @Spy
    private ObjectMapper om;

    @Test
    public void checkNicknameDuplicate_test() {

        // given
        Account account = newAccount("molly_1234", "일당백");

        // stub
        when(accountRepository.findByNickname(any())).thenReturn(Optional.empty());

        // when
        accountService.checkNicknameDuplicate(account.getNickname());

        // then
    }

    @Test
    public void checkNicknameDuplicate_exception_test() {

        // given
        Account account = newAccount("molly_1234", "일당백");

        // stub
        when(accountRepository.findByNickname(any())).thenReturn(Optional.of(account));

        // then
        assertThatThrownBy(() -> accountService.checkNicknameDuplicate(account.getNickname()))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    public void saveAdditionalAccountInfo_success_test() {

        // given
        Long accountId = 1L;
        SaveAccountRequest saveAccountRequest = new SaveAccountRequest();
        saveAccountRequest.setNickname("molly");

        // stub
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        // when
        accountService.saveAdditionalAccountInfo(accountId, saveAccountRequest);

        // then
    }

    @Test
    public void saveAdditionalAccountInfo_failure_test() {

        // given
        Long accountId = 1L;
        SaveAccountRequest saveAccountRequest = new SaveAccountRequest();
        saveAccountRequest.setNickname("molly");

        // stub
        when(accountRepository.findById(any())).thenReturn(Optional.empty());

        // then
        assertThatThrownBy(() -> accountService.saveAdditionalAccountInfo(accountId, saveAccountRequest))
                .isInstanceOf(CustomApiException.class);
    }

    @Test
    public void getAccountDetail_test() {

        // given
        Long accountId = 1L;

        // stub 1
        Account account = newMockAccount(accountId, "kakao_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        // stub 2
        ImageFile imageFile =
                new ImageFile("uploadFileName", "storeFileName", "storeFileUrl");
        AccountImage accountImage = new AccountImage(1L, account, imageFile);
        when(accountImageRepository.findByAccount_id(any())).thenReturn(Optional.of(accountImage));

        // when
        AccountProfileResponse accountProfileResponse = accountService.getAccountDetail(accountId);

        // then
        assertThat(accountProfileResponse.getNickname()).isEqualTo("molly");
        assertThat(accountProfileResponse.getEmail()).isEqualTo("kakao_1234@naver.com");
        assertThat(accountProfileResponse.getProfileImage()).isEqualTo("storeFileUrl");
        assertThat(accountProfileResponse.getProvider()).isEqualTo("kakao");
    }

    @Test
    public void updateAccountNickname_test() {

        // given
        Long accountId = 1L;
        String nickname = "일당백";

        // stub 1
        Account account = newMockAccount(1L, "google_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        // stub 2
        when(accountRepository.findByNickname(any())).thenReturn(Optional.empty());

        // when
        accountService.updateAccountNickname(accountId, nickname);

        // then
    }

    @Test
    public void updateAccountProfileImage_test1() throws IOException {

        // given
        Long accountId = 1L;
        MockMultipartFile multipartFile = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());

        // stub 1
        Account account = newMockAccount(accountId, "kakao_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        // stub 2
        ImageFile imageFile1 =
                new ImageFile("uploadFileName1", "storeFileName1", "storeFileUrl1");
        AccountImage accountImage = new AccountImage(1L, account, imageFile1);
        when(accountImageRepository.findByAccount_id(any())).thenReturn(Optional.of(accountImage));

        // stub 3
        ImageFile imageFile2 =
                new ImageFile("uploadFileName2", "storeFileName2", "storeFileUrl2");
        when(s3Service.upload(any(), any())).thenReturn(imageFile2);

        // when
        accountService.updateAccountProfileImage(accountId, multipartFile);

        // then
    }

    @Test
    public void updateAccountProfileImage_test2() throws IOException {

        // given
        Long accountId = 1L;
        MockMultipartFile multipartFile = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());

        // stub 1
        Account account = newMockAccount(accountId, "kakao_1234", "molly", AccountEnum.CUSTOMER);
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));

        // stub 2
        when(accountImageRepository.findByAccount_id(any())).thenReturn(Optional.empty());

        // stub 3
        ImageFile imageFile2 =
                new ImageFile("uploadFileName", "storeFileName", "storeFileUrl");
        when(s3Service.upload(any(), any())).thenReturn(imageFile2);

        // when
        accountService.updateAccountProfileImage(accountId, multipartFile);

        // then
    }

    @Test
    public void deleteAccountProfileImage_test() {

        // given
        Long accountId = 1L;

        // stub
        Account account = newMockAccount(accountId, "kakao_1234", "molly", AccountEnum.CUSTOMER);
        ImageFile imageFile1 =
                new ImageFile("uploadFileName1", "storeFileName1", "storeFileUrl1");
        AccountImage accountImage = new AccountImage(1L, account, imageFile1);
        when(accountImageRepository.findByAccount_id(any())).thenReturn(Optional.of(accountImage));

        // when
        accountService.deleteAccountProfileImage(accountId);

        // then
    }
}