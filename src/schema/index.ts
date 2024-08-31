import { z } from "zod";

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,}$/;

export const signInSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    nickname: z.string(),
    userId: z.string(),
    password: z
      .string()
      .min(10, { message: "비밀번호는 최소 10자 이상입니다." })
      .regex(
        passwordRegex,
        "비밀번호는 영문, 숫자, 특수기호 조합으로 이루어져야 합니다."
      ),
    checkPassword: z
      .string()
      .min(10, { message: "비밀번호는 최소 10자 이상입니다." }),
    isSeller: z.boolean(),
  })
  .superRefine(({ checkPassword, password }, ctx) => {
    if (checkPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "패스워드가 일치하지 않습니다.",
        path: ["checkPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
  password: z
    .string()
    .min(10, { message: "비밀번호는 최소 10자 이상입니다." })
    .regex(
      passwordRegex,
      "비밀번호는 영문, 숫자, 특수기호 조합으로 이루어져야 합니다."
    ),
});

export const productSchema = z.object({
  sellerId: z.string(),
  productId: z.string(),
  productName: z
    .string()
    .min(1, { message: "최소 한자리 이상의 이름이 필요합니다." }),
  productPrice: z.number().min(1, { message: "금액을 다시 설정해주세요" }),
  productQuantity: z.number().min(1, { message: "수량을 다시 설정해주세요" }),
  productDescription: z
    .string()
    .min(1, { message: "최소 한자리 이상의 설명이 필요합니다." }),
  productCategory: z.string().min(1, { message: "카테고리를 선택해주세요." }),
  productImageUrls: z.array(z.string()),
  productImagePaths: z.array(z.string()),
});
