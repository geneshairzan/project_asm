import { MenuItem, Stack, TextField } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import Context from "@context/app";
import Label from "./label";
import { fetcher } from "@gh/helper/useFetch";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function InputData({ dataId, url, noLabel = false, grow, ...props }) {
  const { app } = useContext(Context);
  const [datas, setDatas] = useState();

  async function fetchData() {
    let res = await fetcher({
      url: url.replaceAll("_", ""),

      method: "get",
    });
    res?.data && setDatas(res?.data);
  }

  async function newData(v) {
    let res = await fetcher({
      url: url.replaceAll("_", ""),
      method: "post",
      data: { name: v },
    });
    if (res?.data) {
      setDatas([...datas, { ...res?.data }]);
      props.onChange({
        target: {
          value: res?.data.id,
          name: props?.name,
        },
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!datas) return "loading";

  return (
    <Stack spacing={0.5} width={props.fullWidth ? "100%" : "auto"} flexGrow={grow}>
      {datas && (
        <>
          {!noLabel && <Label label={props.label} tip={props.tip} />}
          <Autocomplete
            value={datas.find((d) => d.id == props.value) || null}
            onChange={(_, newValue) => {
              if (newValue?.inputValue) {
                newData(newValue?.inputValue);
              } else {
                props.onChange({
                  target: {
                    value: newValue ? newValue.id : "",
                    name: props?.name,
                  },
                });
              }
            }}
            // inputValue={datas.find((d) => d.id == props.value)?.name || ""}
            options={datas}
            getOptionLabel={(option) => option?.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                name={props.name}
                placeholder={props?.label || props?.name}
                type={props.type || "text"}
                inputProps={{
                  ...params?.inputProps,
                  autoComplete: "new-password",
                  bgcolor: "white.main",
                  pl: props.InputProps && 0.5,
                }}
                error={props.error}
                helperText={props.helperText}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem value={option} {...props}>
                {option?.name}
              </MenuItem>
            )}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new valuec
              const isExisting = options.some((option) => inputValue === option.name);
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  name: `Add new ${props.label} : ${inputValue}`,
                });
              }

              return filtered;
            }}
            sx={{
              width: "100%",
              "& .MuiFormHelperText-root": {
                position: "absolute",
                bottom: -16,
              },
            }}
          />
        </>
      )}
    </Stack>
  );
}
