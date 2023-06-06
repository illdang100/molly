package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static kr.co.kumoh.illdang100.mollyspring.dto.board.BoardReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.board.BoardRespDto.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class BoardApiController {

    private final BoardService boardService;

    /**
     * 게시글 작성
     * @param createPostRequest 게시글 정보
     * @param principalDetails 인증된 사용자 정보
     * @return 저장된 게시글 PK
     */
    @PostMapping("/auth/board")
    public ResponseEntity<?> createNewPost(@ModelAttribute @Valid CreatePostRequest createPostRequest,
                                           BindingResult bindingResult,
                                           @AuthenticationPrincipal PrincipalDetails principalDetails) {

        CreatePostResponse createPostResponse = boardService.createPost(principalDetails.getAccount().getId(), createPostRequest);

        return new ResponseEntity<>(new ResponseDto<>(1, "게시글 작성에 성공했습니다", createPostResponse), HttpStatus.OK);
    }

    @PutMapping("/auth/board/{boardId}")
    public ResponseEntity<?> editPost(@AuthenticationPrincipal PrincipalDetails principalDetails) {

        return new ResponseEntity<>(new ResponseDto<>(1, "게시글 수정에 성공했습니다", null), HttpStatus.OK);
    }

    @GetMapping("/board/list")
    public ResponseEntity<?> retrievePostList() {

        return new ResponseEntity<>(new ResponseDto<>(1, "게시글 리스트 조회에 성공했습니다", null), HttpStatus.OK);
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> retrievePostDetail(@PathVariable("boardId") Long boardId) {

        return new ResponseEntity<>(new ResponseDto<>(1, "게시글 상세 조회에 성공했습니다", null), HttpStatus.OK);
    }

    @DeleteMapping("/auth/board/{boardId}")
    public ResponseEntity<?> deletePost(@AuthenticationPrincipal PrincipalDetails principalDetails) {

        // 해당 게시글이 인증된 사용자가 작성한 게시글이 맞는지 검사하기
        return new ResponseEntity<>(new ResponseDto<>(1, "게시글 삭제에 성공했습니다", null), HttpStatus.OK);
    }
}
