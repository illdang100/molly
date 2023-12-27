package kr.co.kumoh.illdang100.mollyspring.util;


import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Component
public class MollyConfigUtil {
    private final List<String> SERVICE_PROFILE_LIST = new ArrayList<>(Arrays.asList("local-1", "local-2", "dev-1", "dev-2"));

}
