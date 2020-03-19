<?php

namespace App\Controller;

use App\Helper\Mailer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class MailerController extends AbstractController
{
    use Mailer;
    private $serializer;

    public function __construct()
    {
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);

    }

    /**
     * @Route("/api/mailer", name="mailer", methods={"POST"})
     * @param Request $request
     * @param MailerInterface $mailer
     * @return JsonResponse
     * @throws TransportExceptionInterface
     */
    public function index(Request $request, MailerInterface $mailer)
    {
        $data = $this->serializer->decode($request->getContent(), 'json');
        if ($this->verifyEmail($data['email'])){
            $mailer->send($this->createTemplatedMessage($data['email'], $data['message'], $data['phone'], $data['name']));

            return $this->json(['success' => 'Votre message à bien été envoyé']);
        }

        return $this->json(['error' => 'L\'un des champs de formulaire n\'est pas correctement rempli']);
    }
}
