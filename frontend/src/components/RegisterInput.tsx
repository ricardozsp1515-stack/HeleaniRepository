type RegisterInputProps = {
  type?: string;
  placeholder: string;
};

export default function RegisterInput({
  type = "text",
  placeholder,
}: RegisterInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
                input
                w-full
                bg-transparent
                border-[#79C798]
                focus:outline-none
                focus:border-green-600
            "
    />
  );
}
