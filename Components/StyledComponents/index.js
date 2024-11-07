import { Stack, Typography} from "@mui/material";

export const LayoutStack = ({mobile, children, ...props}) => {
    return (
        <Stack
            direction={mobile ? "column" : "row"}
            {...props}
        >
            {children}
        </Stack>
    );
}

export const SubheadingText = ({mobile, children, variant, ...props}) => {
    return (
        <Typography variant = {variant} {...props} sx = {{...props.sx ,lineHeight : mobile ? '1.25' : '1.6'}}>
            {children}
        </Typography>
    )
}