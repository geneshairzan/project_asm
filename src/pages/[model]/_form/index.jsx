import React, { useState, useEffect } from "react";

import UI from "@/component/gh/ui";
import Icon from "@gh/icon";

import { useFormik } from "formik";
import { useContext } from "react";
import Context from "@context/app";
import { useRouter } from "next/router";

import * as yup from "yup";
import useFetch from "@gh/helper/useFetch";

import DynamicFormRenderer from "@gh/form/renderer";
import RelationForm from "@gh/form/renderer/relationForm";
import { getInfo } from "@/model";

export default function Main({ refdata }) {
  const { app } = useContext(Context);
  const router = useRouter();
  const schema = useFetch({ url: `schema/${router.query.model}` });
  const modelInfo = getInfo(router.query.model);

  const formik = useFormik({
    initialValues: refdata ? refdata : {},
    validationSchema: modelInfo?.validationSchema || null,
    onSubmit: async (payload) => {
      let main_payload = Object.keys(payload)
        .filter((key) => typeof payload[key] != "object")
        .reduce((obj, key) => {
          obj[key] = payload[key];
          return obj;
        }, {});

      let res = await schema.fetch(
        {
          url: `${router.query.model}`,
          method: "post",
          data: {
            ...main_payload,
          },
        },
        {
          type: "success",
          message: "Form Submitted",
        }
      );

      let sec_payload = Object.keys(payload).filter((key) => Array.isArray(payload[key]));
      if (res?.id && sec_payload?.length > 0) {
        sec_payload.forEach(async (el) => {
          await schema.fetch(
            {
              url: el,
              // url: `dev/test`,
              method: "post",
              data: payload[el]?.map((d) => ({ ...d, project_id: res.id })),
            },
            {
              type: "success",
              message: "Form Submitted",
            }
          );
        });
      }

      router.push(`/${router.query.model}`);
    },
  });

  function hiddenCol(d) {
    if (modelInfo?.form?.include_field?.includes(d?.name)) {
      return true;
    }
    let hidden = ["id", "deleted_at", "created_at", "updated_at", "organization_id"];
    if (hidden.includes(d.name) || d.kind == "object" || d.deleted_at) {
      return false;
    }

    return true;
  }
  return (
    <UI.Col spacing={2}>
      <UI.Row alignItems="center" spacing={1}>
        <UI.IconButton onClick={() => router.back()}>
          <Icon.Back />
        </UI.IconButton>
        <UI.Text variant="h6" bold capitalize>
          {modelInfo?.label || router.query.model}
        </UI.Text>
      </UI.Row>

      {/* ACTUAL FORM RENDERER */}
      {schema
        .get()
        ?.filter(hiddenCol)
        .map((d, ix) => (
          <React.Fragment key={ix}>
            {!Boolean(d.isList) && (
              <DynamicFormRenderer formik={formik} d={{ ...d, ...modelInfo?.form?.[d.name] }} key={ix} name={d.name} />
            )}

            {Boolean(d.isList) && ( //equals to has many
              <RelationForm
                parent={router.query.model}
                hiddenCol={hiddenCol}
                model={d.name}
                name={modelInfo?.form?.[d.name]?.alias || d.name}
                value={formik.values[d.name] || []}
                onChange={(v) => {
                  formik.setFieldValue(d.name, v?.target?.value);
                }}
              />
            )}
          </React.Fragment>
        ))}

      <UI.Row alignItems="flex-end">
        <UI.Button
          onClick={formik.handleSubmit}
          type="submit"
          sx={{
            width: "180px",
          }}
        >
          Save Changes
        </UI.Button>
      </UI.Row>
    </UI.Col>
  );
}
