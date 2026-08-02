/**
 * Slug inexistente.
 *
 * Quem cai aqui é o cliente final de algum contador, que digitou o endereço
 * errado ou seguiu um link antigo — não é alguém navegando pelo produto. Por
 * isso a página não oferece "criar meu link" nem fala de conta: para essa
 * pessoa, o Aprumo não é um produto que ela usa, é a página do contador dela.
 */
export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Esta página não existe
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        O endereço pode ter sido digitado com algum erro, ou o link mudou de
        lugar. Vale conferir com quem enviou.
      </p>
    </main>
  );
}
