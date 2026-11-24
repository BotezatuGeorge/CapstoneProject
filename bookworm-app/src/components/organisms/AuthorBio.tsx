import type { Author } from '../../types';

interface AuthorBioProps {
  author: Author;
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-white mb-4">About the writer</h2>
      <div className="flex gap-5 items-start">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-white">{author.name}</h3>
          {author.bio.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm text-muted leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
