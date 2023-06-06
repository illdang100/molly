package kr.co.kumoh.illdang100.mollyspring.dto.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

public class BoardRespDto {

    @AllArgsConstructor
    @Getter @Setter
    public static class CreatePostResponse {
        private Long boardId;
    }
}
